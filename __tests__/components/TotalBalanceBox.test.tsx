import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import TotalBalanceBox from "@/components/TotalBalanceBox";

// Mock DoughnutChart to keep test lightweight
jest.mock("@/components/DoughnutChart", () => {
  function MockDoughnutChart() {
    return <div data-testid="doughnut-chart" />;
  }
  return MockDoughnutChart;
});

describe("TotalBalanceBox Component", () => {
  const mockAccounts = [
    {
      id: "acc_1",
      appwriteItemId: "item_1",
      name: "Chase Savings",
      currentBalance: 2500,
      availableBalance: 2400,
      officialName: "Chase Bank",
      mask: "1234",
      institutionId: "ins_1",
      type: "depository",
      subtype: "savings",
      shareableId: "share_1",
    },
  ];

  it("renders the bank accounts count", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={1}
        totalCurrentBalance={2500}
      />
    );

    expect(screen.getByText("Bank Accounts: 1")).toBeInTheDocument();
  });

  it("renders Total Current Balance label", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={2}
        totalCurrentBalance={5000}
      />
    );

    expect(screen.getByText("Total Current Balance")).toBeInTheDocument();
  });

  it("renders the doughnut chart", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={1}
        totalCurrentBalance={2500}
      />
    );

    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });
});
