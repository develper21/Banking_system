"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";
import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: data.senderBank });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        {/* Source Bank Selection Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-16 font-semibold text-gray-900">Source Bank Selection</h3>
              <p className="text-14 text-gray-600">Choose your source account to transfer funds from</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="senderBank"
            render={() => (
              <FormItem>
                <FormLabel className="text-14 font-medium text-gray-700">
                  Select Source Bank
                </FormLabel>
                <FormDescription className="text-12 text-gray-500 mb-3">
                  Select the bank account you want to transfer funds from
                </FormDescription>
                <FormControl>
                  <BankDropdown
                    accounts={accounts}
                    setValue={form.setValue}
                    otherStyles="!w-full"
                  />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Transfer Note Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-4h-4v4a2 2 0 002 2zm0 1H4a2 2 0 00-2-2v-4a2 2 0 012-2h4v4a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-16 font-semibold text-gray-900">Transfer Note (Optional)</h3>
              <p className="text-14 text-gray-600">Provide any additional information or instructions</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-medium text-gray-700">
                  Transfer Note
                </FormLabel>
                <FormDescription className="text-12 text-gray-500 mb-3">
                  Write a short note for the recipient
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Write a short note here"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Recipient Details Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0v4m0 0v4m0-4h8M8 7a4 4 0 11-8 0v4m0 0v4m0-4h8" />
              </svg>
            </div>
            <div>
              <h3 className="text-16 font-semibold text-gray-900">Recipient Information</h3>
              <p className="text-14 text-gray-600">Enter the recipient's bank account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormDescription className="text-12 text-gray-500 mb-3">
                    Recipient's email address
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sharableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Shareable ID
                  </FormLabel>
                  <FormDescription className="text-12 text-gray-500 mb-3">
                    Recipient's public account number
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Enter public account number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amount Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-16 font-semibold text-gray-900">Transfer Amount</h3>
              <p className="text-14 text-gray-600">Enter the amount to transfer</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-14 font-medium text-gray-700">
                  Amount
                </FormLabel>
                <FormDescription className="text-12 text-gray-500 mb-3">
                  Enter the transfer amount
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="ex: 5.00"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 text-16 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
