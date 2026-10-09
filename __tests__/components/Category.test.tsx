import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import Category from "@/components/Category";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe("Category Component", () => {
  const mockCategory = {
    name: "Food and Drink",
    count: 8,
    totalCount: 20,
  };

  it("renders category name and count", () => {
    render(<Category category={mockCategory} />);

    expect(screen.getByText("Food and Drink")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders with fallback styles for unrecognized category", () => {
    const unknownCategory = {
      name: "Custom Category",
      count: 2,
      totalCount: 10,
    };

    render(<Category category={unknownCategory} />);
    expect(screen.getByText("Custom Category")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
