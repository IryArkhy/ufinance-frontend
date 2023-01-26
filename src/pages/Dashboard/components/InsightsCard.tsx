import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, Button, Card, Divider, Typography } from '@mui/material';

type IProps = {
  imgSrc: string;
  title: string;
  indicator: string;
  buttonLabelEntity: string;
  onButtonClick: () => void;
};

export function InsightsCard({
  imgSrc,
  title,
  indicator,
  buttonLabelEntity,
  onButtonClick,
}: IProps) {
  return (
    <Card sx={{ width: '100%' }}>
      <Box p={5} display="flex" gap={2}>
        <img src={imgSrc} style={{ width: 55 }} />
        <Box>
          <Typography variant="subtitle1" color="GrayText" lineHeight={0.75} mb={1}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {indicator}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box p={1}>
        <Button variant="text" endIcon={<ArrowForwardRoundedIcon />} onClick={onButtonClick}>
          See all {buttonLabelEntity}
        </Button>
      </Box>
    </Card>
  );
}
