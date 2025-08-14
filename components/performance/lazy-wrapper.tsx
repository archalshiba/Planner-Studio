import { Suspense, type ComponentType, type ReactNode } from "react"
import { LoadingState } from "@/components/plan/loading-state"

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  message?: string
}

export function LazyWrapper({ children, fallback, message = "Loading..." }: LazyWrapperProps) {
  return <Suspense fallback={fallback || <LoadingState message={message} />}>{children}</Suspense>
}

export function withLazyLoading<P extends object>(Component: ComponentType<P>, loadingMessage?: string) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper message={loadingMessage}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
}
