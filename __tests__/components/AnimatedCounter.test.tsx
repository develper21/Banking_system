import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import AnimatedCounter from "@/components/AnimatedCounter";

// Mock react-countup to render static value for tests
jest.mock("react-countup", () => {
  return function MockCountUp({ prefix, end, decimals }: any) {
    return <span data-testid="count-up">{`${prefix}${Number(end).toFixed(decimals)}`}</span>;
  };
});

describe("AnimatedCounter Component", () => {
  it("renders formatted amount with currency prefix", () => {
    render(<AnimatedCounter amount={1500.5} />);

    const counter = screen.getByTestId("count-up");
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent("$1500.50");
  });
});
