import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import Footer from "@/components/Footer";
import { logoutAccount } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

jest.mock("@/lib/actions/user.actions", () => ({
  logoutAccount: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe("Footer Component", () => {
  const mockUser = {
    $id: "user_1",
    email: "john@example.com",
    userId: "u_1",
    dwollaCustomerUrl: "",
    dwollaCustomerId: "",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    dateOfBirth: "1990-01-01",
    ssn: "1234",
  };

  it("renders user first name initial and email", () => {
    render(<Footer user={mockUser} type="desktop" />);

    expect(screen.getByText("J")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("handles logout and redirects to sign-in page", async () => {
    const router = useRouter();
    (logoutAccount as jest.Mock).mockResolvedValueOnce(true);

    render(<Footer user={mockUser} type="desktop" />);
    const logoutBtn = screen.getByAltText("jsm");

    fireEvent.click(logoutBtn);
    // Allow promises to resolve
    await Promise.resolve();

    expect(logoutAccount).toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith("/sign-in");
  });
});
