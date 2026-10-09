import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BankTabItem } from "@/components/BankTabItem";
import { useRouter } from "next/navigation";

describe("BankTabItem Component", () => {
  const mockAccount = {
    id: "acc_1",
    appwriteItemId: "bank_item_1",
    name: "Chase Checking",
    currentBalance: 3000,
    availableBalance: 2900,
    officialName: "JPMorgan Chase",
    mask: "4321",
    institutionId: "ins_1",
    type: "depository",
    subtype: "checking",
    shareableId: "share_123",
  };

  it("renders bank account name", () => {
    render(<BankTabItem account={mockAccount} appwriteItemId="bank_item_2" />);
    expect(screen.getByText("Chase Checking")).toBeInTheDocument();
  });

  it("applies active styles when item matches current appwriteItemId", () => {
    render(<BankTabItem account={mockAccount} appwriteItemId="bank_item_1" />);
    const tabName = screen.getByText("Chase Checking");
    expect(tabName).toHaveClass("text-lime-800");
  });

  it("calls router.push when clicked to change bank tab", () => {
    const router = useRouter();
    render(<BankTabItem account={mockAccount} appwriteItemId="bank_item_2" />);

    const item = screen.getByText("Chase Checking");
    fireEvent.click(item);

    expect(router.push).toHaveBeenCalled();
  });
});
