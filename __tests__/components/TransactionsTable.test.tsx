import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import TransactionsTable from "@/components/TransactionsTable";

describe("TransactionsTable Component", () => {
  const mockTransactions = [
    {
      id: "txn_1",
      $id: "txn_1",
      name: "Starbucks Coffee",
      paymentChannel: "in store",
      type: "debit",
      accountId: "acc_1",
      amount: 4.75,
      pending: false,
      category: "Food and Drink",
      date: "2024-01-10T12:00:00Z",
      image: "",
      $createdAt: "2024-01-10T12:00:00Z",
      channel: "in store",
      senderBankId: "bank_1",
      receiverBankId: "bank_2",
    },
    {
      id: "txn_2",
      $id: "txn_2",
      name: "Payroll Deposit",
      paymentChannel: "online",
      type: "credit",
      accountId: "acc_1",
      amount: 3200,
      pending: false,
      category: "Income",
      date: "2024-01-05T08:00:00Z",
      image: "",
      $createdAt: "2024-01-05T08:00:00Z",
      channel: "online",
      senderBankId: "bank_1",
      receiverBankId: "bank_2",
    },
  ];

  it("renders table column headers", () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText("Transaction")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Channel")).toBeInTheDocument();
  });

  it("renders transaction names and payment details", () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText("Starbucks Coffee")).toBeInTheDocument();
    expect(screen.getByText("Payroll Deposit")).toBeInTheDocument();
    expect(screen.getByText("in store")).toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("renders debit transactions with minus sign", () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText("-$4.75")).toBeInTheDocument();
    expect(screen.getByText("$3,200.00")).toBeInTheDocument();
  });
});
