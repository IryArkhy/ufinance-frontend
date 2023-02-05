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

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
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
          <Typography>Sorry.. there was an error.</Typography>
          <Button onClick={handleNavigate}>Navigate to Dashboard page.</Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
