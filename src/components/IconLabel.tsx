import { SvgIconComponent } from '@mui/icons-material';
import { Typography } from '@mui/material';

interface IconLabelProps {
  icon: SvgIconComponent;
  label: string;
}

export default function IconLabel(props: IconLabelProps) {
  return (
    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
      <props.icon fontSize="inherit" sx={{ color: 'text.secondary' }} />
      {props.label}
    </Typography>
  );
}
