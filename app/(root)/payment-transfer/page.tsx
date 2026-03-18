import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn?.$id) {
    return (
      <div className="transactions">
        <HeaderBox
          title="Payment Transfer"
          subtext="Please sign in to start transferring funds."
        />
        <div className="rounded-lg border border-dashed border-red-200 bg-white p-6 text-center">
          <p className="text-16 font-medium text-red-600">Please sign in to access payment transfer.</p>
        </div>
      </div>
    );
  }

  const accounts = await getAccounts({ userId: loggedIn.$id });
  const accountsData = accounts?.data ?? [];

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Payment Transfer"
          subtext="Please provide any specific details or notes related to the payment transfer"
        />
      </div>

      {accountsData.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-center shadow-sm">
          <p className="text-16 font-semibold text-gray-700">No linked bank accounts found.</p>
          <p className="text-14 text-gray-500 mt-2">Connect a bank first from the My Banks page to transfer funds.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <PaymentTransferForm accounts={accountsData} />
        </div>
      )}
    </div>
  );
};

export default Transfer;
