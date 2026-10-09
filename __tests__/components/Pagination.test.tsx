import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/navigation";

// Mock next/image to render standard img tag
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe("Pagination Component", () => {
  it("renders current page and total pages", () => {
    render(<Pagination page={2} totalPages={5} />);
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("disables Prev button on first page", () => {
    render(<Pagination page={1} totalPages={5} />);
    const prevButton = screen.getByRole("button", { name: /prev/i });
    expect(prevButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<Pagination page={5} totalPages={5} />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls router.push when Next button is clicked", () => {
    const router = useRouter();
    render(<Pagination page={2} totalPages={5} />);
    const nextButton = screen.getByRole("button", { name: /next/i });

    fireEvent.click(nextButton);
    expect(router.push).toHaveBeenCalled();
  });
});
