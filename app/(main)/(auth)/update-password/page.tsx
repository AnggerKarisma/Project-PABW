// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input"; // Sesuaikan path jika perlu
// import { Label } from "@/components/ui/label"; // Sesuaikan path jika perlu
// import { Button } from "@/components/ui/button"; // Sesuaikan path jika perlu
// import { createClient } from "@/utils/supabase/client"; // Sesuaikan path jika perlu
// import { useRouter } from "next/navigation";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// // Skema Zod untuk validasi form update password
// const updatePasswordSchema = z
//   .object({
//     password: z
//       .string()
//       .min(6, "Kata sandi baru harus terdiri dari minimal 6 karakter"),
//     confirmPassword: z
//       .string()
//       .min(6, "Konfirmasi kata sandi harus terdiri dari minimal 6 karakter"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Konfirmasi kata sandi tidak cocok",
//     path: ["confirmPassword"], // Path error untuk field confirmPassword
//   });

// type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

// const UpdatePasswordPage = () => {
//   const supabase = createClient();
//   const router = useRouter();

//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [canUpdatePassword, setCanUpdatePassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors: formErrors }, // Mengganti nama variabel errors dari form
//   } = useForm<UpdatePasswordFormData>({
//     resolver: zodResolver(updatePasswordSchema),
//   });

//   useEffect(() => {
//     // Supabase client secara otomatis menangani token dari URL hash.
//     // Kita perlu memantau perubahan status autentikasi.
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === "PASSWORD_RECOVERY") {
//           // Pengguna telah berhasil masuk menggunakan tautan pemulihan kata sandi.
//           // Sekarang mereka dapat mengatur kata sandi baru.
//           setCanUpdatePassword(true);
//           setMessage("Anda sekarang dapat mengatur kata sandi baru Anda.");
//         } else if (session) {
//           // Jika ada sesi lain yang aktif dan bukan PASSWORD_RECOVERY,
//           // mungkin pengguna sudah login atau token tidak valid lagi.
//           // Untuk kasus recovery, kita harapkan event PASSWORD_RECOVERY.
//           // Jika pengguna sudah login dengan sesi normal, mungkin redirect ke dashboard.
//         } else {
//           // Jika tidak ada sesi dan bukan PASSWORD_RECOVERY, mungkin token sudah kedaluwarsa atau tidak valid.
//           // setError("Tautan atur ulang kata sandi tidak valid atau sudah kedaluwarsa. Silakan coba lagi.");
//           // router.push("/forgot-password");
//         }
//       }
//     );

//     // Cek sesi saat komponen dimuat, siapa tahu event sudah terjadi atau hash sudah diproses
//     // (Ini mungkin tidak selalu diperlukan jika onAuthStateChange menangkapnya dengan baik)
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       // Jika ada sesi dan belum dihandle oleh onAuthStateChange (misalnya, jika user refresh halaman dengan hash),
//       // event PASSWORD_RECOVERY mungkin sudah lewat. Ini bagian yang agak tricky.
//       // Supabase umumnya akan membuat sesi jika hash valid.
//       // Untuk kesederhanaan, kita bisa asumsikan onAuthStateChange akan menangani atau
//       // Supabase sudah membuat sesi dan kita bisa langsung coba update password.
//       // Jika tidak ada session, bisa jadi link tidak valid.
//       if (window.location.hash.includes("access_token") && !session) {
//         // Tunggu sebentar Supabase memproses hash, lalu cek lagi
//         // Ini untuk menangani kasus jika `onAuthStateChange` belum sempat terpanggil
//         // sebelum render awal selesai.
//         setTimeout(async () => {
//           const {
//             data: { session: newSession },
//           } = await supabase.auth.getSession();
//           if (newSession) {
//             setCanUpdatePassword(true);
//             setMessage("Anda sekarang dapat mengatur kata sandi baru Anda.");
//           } else {
//             setError(
//               "Tautan atur ulang kata sandi tidak valid atau sudah kedaluwarsa. Silakan coba minta tautan baru."
//             );
//           }
//         }, 1000);
//       } else if (session) {
//         // Jika sudah ada sesi (mungkin dari tautan recovery yang valid)
//         setCanUpdatePassword(true);
//       } else if (!window.location.hash.includes("access_token")) {
//         // Jika tidak ada hash token di URL, pengguna seharusnya tidak di sini
//         setError(
//           "Halaman ini hanya untuk mengatur ulang kata sandi setelah menerima tautan email."
//         );
//         // router.push("/sign-in");
//       }
//     };
//     checkSession();

//     return () => {
//       authListener?.unsubscribe();
//     };
//   }, [supabase, router]);

//   const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
//     setIsLoading(true);
//     setMessage(null);
//     setError(null);

//     if (!canUpdatePassword) {
//       setError(
//         "Tidak dapat memperbarui kata sandi saat ini. Pastikan Anda mengakses halaman ini dari tautan email yang valid."
//       );
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const { error: updateError } = await supabase.auth.updateUser({
//         password: data.password,
//       });

//       if (updateError) {
//         throw updateError;
//       }

//       setMessage(
//         "Kata sandi Anda telah berhasil diperbarui! Anda akan diarahkan ke halaman login."
//       );
//       // Kosongkan password fields (opsional)
//       // reset(); // Jika menggunakan react-hook-form

//       // Redirect ke halaman login setelah beberapa detik
//       setTimeout(() => {
//         router.push("/sign-in"); // Arahkan ke halaman login
//       }, 3000);
//     } catch (err: any) {
//       console.error("Error updating password:", err);
//       setError(
//         err.message || "Gagal memperbarui kata sandi. Silakan coba lagi."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
//       <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
//           ATUR ULANG KATA SANDI
//         </h2>

//         {message && (
//           <div className="bg-green-50 dark:bg-green-700 dark:text-green-100 border border-green-300 dark:border-green-600 text-green-700 p-3 rounded-md text-sm mb-6">
//             {message}
//           </div>
//         )}
//         {error && (
//           <div className="bg-red-50 dark:bg-red-700 dark:text-red-100 border border-red-300 dark:border-red-600 text-red-700 p-3 rounded-md text-sm mb-6">
//             {error}
//           </div>
//         )}

//         {canUpdatePassword &&
//           !message && ( // Hanya tampilkan form jika bisa update dan belum ada pesan sukses akhir
//             <form
//               className="space-y-6"
//               onSubmit={handleSubmit(handleUpdatePassword)}
//             >
//               <div>
//                 <Label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Kata Sandi Baru
//                 </Label>
//                 <Input
//                   type="password"
//                   id="password"
//                   placeholder="Minimal 6 karakter"
//                   className={`w-full border ${
//                     formErrors.password ? "border-red-500" : "border-gray-300"
//                   } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
//                   {...register("password")}
//                   disabled={isLoading}
//                 />
//                 {formErrors.password && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {formErrors.password.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Konfirmasi Kata Sandi Baru
//                 </Label>
//                 <Input
//                   type="password"
//                   id="confirmPassword"
//                   placeholder="Ulangi kata sandi baru"
//                   className={`w-full border ${
//                     formErrors.confirmPassword
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   } dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
//                   {...register("confirmPassword")}
//                   disabled={isLoading}
//                 />
//                 {formErrors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {formErrors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Memperbarui..." : "Perbarui Kata Sandi"}
//               </Button>
//             </form>
//           )}
//         {!canUpdatePassword &&
//           !error &&
//           !message && ( // Tampilan loading awal atau jika token tidak valid
//             <p className="text-center text-gray-500 dark:text-gray-400">
//               Memverifikasi tautan atur ulang kata sandi...
//             </p>
//           )}
//       </div>
//     </div>
//   );
// };

// export default UpdatePasswordPage;
