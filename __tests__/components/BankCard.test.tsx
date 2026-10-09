import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import BankCard from "@/components/BankCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock Copy component
jest.mock("@/components/Copy", () => ({
  __esModule: true,
  default: ({ title }: { title?: string }) => <div data-testid="copy-id">{title}</div>,
}));

describe("BankCard Component", () => {
  const mockAccount = {
    id: "acc_1",
    appwriteItemId: "item_123",
    name: "Savings Account",
    currentBalance: 8450.25,
    availableBalance: 8450.25,
    officialName: "Chase Savings",
    mask: "9876",
    institutionId: "ins_1",
    type: "depository",
    subtype: "savings",
    shareableId: "share_bank_9876",
  };

  it("renders bank account name, masked account number and user name", () => {
    render(<BankCard account={mockAccount} userName="Alice Smith" />);

    expect(screen.getByText("Savings Account")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("9876")).toBeInTheDocument();
    expect(screen.getByText("$8,450.25")).toBeInTheDocument();
  });

  it("renders shareable ID for copying when showBalance is true", () => {
    render(<BankCard account={mockAccount} userName="Alice Smith" showBalance={true} />);

    expect(screen.getByTestId("copy-id")).toHaveTextContent("share_bank_9876");
  });
});
