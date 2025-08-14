import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { IdeaInputForm } from "@/components/forms/idea-input-form"
import { useAuth } from "@/lib/auth"
import { aiClient } from "@/lib/ai-client"
import jest from "jest" // Import jest to declare it

// Mock dependencies
jest.mock("@/lib/auth")
jest.mock("@/lib/ai-client")
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockAiClient = aiClient as jest.Mocked<typeof aiClient>

describe("IdeaInputForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      signIn: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
    })

    mockAiClient.generatePlan.mockResolvedValue({
      success: true,
      plan: {
        id: "test-plan-1",
        title: "Test Project",
        description: "A test project description",
        features: { core: ["Feature 1", "Feature 2"] },
        techStack: { frontend: ["React", "TypeScript"] },
        roadmap: { phases: [] },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the form correctly", () => {
    render(<IdeaInputForm />)

    expect(screen.getByText("Describe Your Project Idea")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Generate Project Plan/ })).toBeInTheDocument()
  })

  it("allows user to input an idea", async () => {
    const user = userEvent.setup()
    render(<IdeaInputForm />)

    const textarea = screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/)
    await user.type(textarea, "A todo app for teams")

    expect(textarea).toHaveValue("A todo app for teams")
  })

  it("generates a plan when form is submitted", async () => {
    const user = userEvent.setup()
    render(<IdeaInputForm />)

    const textarea = screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/)
    const submitButton = screen.getByRole("button", { name: /Generate Project Plan/ })

    await user.type(textarea, "A todo app for teams")
    await user.click(submitButton)

    expect(mockAiClient.generatePlan).toHaveBeenCalledWith({
      idea: "A todo app for teams",
      templateId: undefined,
      context: expect.any(Object),
    })

    await waitFor(() => {
      expect(screen.getByText("Generate New Plan")).toBeInTheDocument()
    })
  })

  it("shows loading state during generation", async () => {
    const user = userEvent.setup()
    mockAiClient.generatePlan.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)))

    render(<IdeaInputForm />)

    const textarea = screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/)
    const submitButton = screen.getByRole("button", { name: /Generate Project Plan/ })

    await user.type(textarea, "A todo app for teams")
    await user.click(submitButton)

    expect(screen.getByText("Generating Your Project Plan...")).toBeInTheDocument()
  })

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup()
    mockAiClient.generatePlan.mockRejectedValue(new Error("API Error"))

    render(<IdeaInputForm />)

    const textarea = screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/)
    const submitButton = screen.getByRole("button", { name: /Generate Project Plan/ })

    await user.type(textarea, "A todo app for teams")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument()
    })
  })

  it("allows selecting example ideas", async () => {
    const user = userEvent.setup()
    render(<IdeaInputForm />)

    const exampleButton = screen.getByText("A mobile app for tracking plant watering schedules")
    await user.click(exampleButton)

    const textarea = screen.getByPlaceholderText(/Example: A mobile app for tracking plant watering schedules/)
    expect(textarea).toHaveValue("A mobile app for tracking plant watering schedules")
  })
})
