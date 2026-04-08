"use server";

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCart() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: {
        book: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, message: "Berhasil mengambil keranjang", data: cartItems };
  } catch (error) {
    console.error("getCart Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem", data: [] };
  }
}

export async function addToCart(bookId: string, quantity: number = 1) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, message: "Harap login untuk menambahkan ke keranjang" };
    }

    // Ambil stock buku
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, stock: true, title: true }
    });

    if (!book) {
      return { success: false, message: "Buku tidak ditemukan" };
    }

    if (quantity <= 0) return { success: false, message: "Kuantitas tidak valid" };

    // Cek apakah item sudah ada di keranjang
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: {
          userId: session.id,
          bookId: book.id,
        }
      }
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      
      // Guard Check: Validasi stock
      if (newQty > book.stock) {
        return { 
          success: false, 
          message: `Stock tidak mencukupi. Stock '${book.title}' tersisa ${book.stock}` 
        };
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });

      return { success: true, message: "Kuantitas buku di keranjang berhasil ditambahkan" };
    }

    // Jika belum ada, tapi pesanan melebihi stock awal
    if (quantity > book.stock) {
      return { 
        success: false, 
        message: `Stock tidak mencukupi. Stock '${book.title}' tersisa ${book.stock}` 
      };
    }

    await prisma.cartItem.create({
      data: {
        userId: session.id,
        bookId: book.id,
        quantity,
      },
    });

    return { success: true, message: "Buku berhasil ditambahkan ke keranjang" };
  } catch (error) {
    console.error("addToCart Error:", error);
    return { success: false, message: "Gagal menambahkan buku ke keranjang" };
  } finally {
    revalidatePath("/");
  }
}

export async function updateCartItemQuantity(cartItemId: string, newQuantity: number) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Unauthorized" };

    if (newQuantity <= 0) {
      return { success: false, message: "Kuantitas tidak valid" };
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { book: { select: { stock: true, title: true } } },
    });

    if (!cartItem) return { success: false, message: "Item keranjang tidak ditemukan" };
    if (cartItem.userId !== session.id) return { success: false, message: "Akses ditolak" };

    // Validasi Limit Stock
    if (newQuantity > cartItem.book.stock) {
      return { 
        success: false, 
        message: `Maksimal stock '${cartItem.book.title}' adalah ${cartItem.book.stock}` 
      };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });

    return { success: true, message: "Kuantitas diupdate" };
  } catch (error) {
    console.error("updateCartItem Error:", error);
    return { success: false, message: "Terjadi kesalahan saat mengupdate keranjang" };
  } finally {
    revalidatePath("/");
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Unauthorized" };

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) return { success: false, message: "Item keranjang tidak ditemukan" };
    if (cartItem.userId !== session.id) return { success: false, message: "Akses ditolak" };

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { success: true, message: "Item berhasil dihapus dari keranjang" };
  } catch (error) {
    console.error("removeFromCart Error:", error);
    return { success: false, message: "Gagal menghapus item dari keranjang" };
  } finally {
    revalidatePath("/");
  }
}

export async function processCheckout(itemIds: string[], paymentMethod: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, message: "Harap login untuk checkout" };

    if (!itemIds || itemIds.length === 0) {
      return { success: false, message: "Pilih minimal satu item untuk di-checkout" };
    }

    const validPaymentMethods = ["Transfer Bank", "E-wallet", "COD"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return { success: false, message: "Metode pembayaran tidak valid" };
    }

    // Mulai transaction untuk handle stock dll
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ambil cart items sekalian include book
      const cartItems = await tx.cartItem.findMany({
        where: { 
          id: { in: itemIds },
          userId: session.id 
        },
        include: { book: true }
      });

      if (cartItems.length === 0) throw new Error("Items tidak valid");

      // Validasi dan Hitung Harga Total
      let total = 0;
      for (const item of cartItems) {
        if (item.quantity > item.book.stock) {
          throw new Error(`Stock buku '${item.book.title}' hanya tersisa ${item.book.stock}`);
        }
        total += item.book.price * item.quantity;
      }

      // 2. Kurangi stock buku & Update/Create User Book Progress
      for (const item of cartItems) {
        await tx.book.update({
          where: { id: item.book.id },
          data: { stock: { decrement: item.quantity } }
        });

        await tx.userBookProgress.upsert({
          where: {
            userId_bookId: {
              userId: session.id,
              bookId: item.book.id
            }
          },
          update: {},
          create: {
            userId: session.id,
            bookId: item.book.id,
            status: "reading",
            progress: 0
          }
        });
      }

      // 3. Create Orders
      const order = await tx.order.create({
        data: {
          userId: session.id,
          total: total,
          status: "pending",
          paymentMethod: paymentMethod,
          paymentStatus: "Unchecked",
          orderItems: {
            create: cartItems.map(item => ({
              bookId: item.bookId,
              price: item.book.price,
              quantity: item.quantity
            }))
          }
        }
      });

      // 4. Hapus Keranjang yang sudah di-checkout
      await tx.cartItem.deleteMany({
        where: { id: { in: itemIds }, userId: session.id }
      });

      return order;
    });

    return { success: true, message: "Pesanan berhasil dibuat!", data: result };
  } catch (error: unknown) {
    console.error("processCheckout Error:", error);
    // Return explicit error message jika dari throw kita sendiri
    return { success: false, message: (error instanceof Error ? error.message : "Gagal memproses checkout") || "Gagal memproses checkout" };
  } finally {
    revalidatePath("/");
  }
}

