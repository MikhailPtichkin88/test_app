import { render } from '@testing-library/react'
import { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export interface componentRenderOptions {
  route?: string
}

interface IProps {
  children: ReactNode
  options?: componentRenderOptions
}
export const TestProvider = (props: IProps) => {
  const { children, options = {} } = props

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const { route = '/' } = options
  return (
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>
        <div className={`app`}>{children}</div>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

export function componentRender(
  component: ReactNode,
  options: componentRenderOptions = {}
) {
  return render(<TestProvider options={options}>{component}</TestProvider>)
}