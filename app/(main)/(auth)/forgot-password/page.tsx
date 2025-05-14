import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center flex justify-center items-center">
          LUPA KATA SANDI
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Silakan masukkan alamat email yang terkait dengan akun Anda.
          Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>
        <form className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="mahakamstore@gmail.com"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
          >
            Atur Ulang Kata Sandi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
