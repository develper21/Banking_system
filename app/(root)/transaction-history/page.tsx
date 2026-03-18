import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";

const TransactionHistory = async ({ searchParams }: SearchParamProps) => {
  const id = searchParams?.id as string | undefined;
  const page = searchParams?.page as string | undefined;
  const currentPage = Number(page) || 1;
  const loggedIn = await getLoggedInUser();

  if (!loggedIn?.$id) {
    return (
      <div className="transactions">
        <p className="text-center text-red-500">Please sign in to view transaction history.</p>
      </div>
    );
  }

  const accounts = await getAccounts({ userId: loggedIn.$id });

  const accountsData = accounts?.data ?? [];

  if (!accountsData.length) {
    return (
      <div className="transactions">
        <p className="text-center text-gray-300">No linked bank accounts. Please connect a bank first.</p>
      </div>
    );
  }

  const appwriteItemId = id || accountsData[0]?.appwriteItemId;

  if (!appwriteItemId) {
    return (
      <div className="transactions">
        <p className="text-center text-gray-300">Unable to determine selected bank account.</p>
      </div>
    );
  }

  const account = await getAccount({ appwriteItemId });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 text-blue-25">{account?.data.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
