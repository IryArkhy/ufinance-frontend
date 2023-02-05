import { Button, Container, Typography } from '@mui/material';
import React from 'react';

interface Props {
  children?: React.ReactNode;
  onNavigate: () => void;
}

export class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Did catch', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const handleNavigate = () => {
        this.setState({ hasError: false });
        this.props.onNavigate();
      };
      return (
        <Container>
          <Typography>Вибачте, виникла помилка.</Typography>
          <Button onClick={handleNavigate}>
            Перейдіть до Головної сторінки і спробуйте знову.
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
