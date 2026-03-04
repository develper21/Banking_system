import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import HeaderBox from '@/components/HeaderBox'

describe('HeaderBox', () => {
  it('renders title correctly', () => {
    render(<HeaderBox title="Test Title" type="title" subtext="Subtitle" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders subtext when provided', () => {
    render(<HeaderBox title="Test Title" type="title" subtext="Test Subtitle" />)
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('renders user information when type is greeting', () => {
    render(
      <HeaderBox 
        title="Welcome" 
        type="greeting" 
        user="John Doe"
        subtext="Welcome back"
      />
    )
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
