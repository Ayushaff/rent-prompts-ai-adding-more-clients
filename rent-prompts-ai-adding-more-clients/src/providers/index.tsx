import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { UserProvider } from './User'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <UserProvider>
      <ThemeProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </ThemeProvider>
    </UserProvider>
  )
}
