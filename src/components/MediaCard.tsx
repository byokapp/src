import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ChevronDown, Edit2, Edit3, Trash2, X } from 'preact-feather';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';

import ExternalLink from './ExternalLink';

import { KNOWN_IMAGES } from '@/images';
import { usePersistentAppStore } from '@/stores/persistentAppState';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

type MediaCardProps = {
  component: string;
  alt?: string;
};
const MediaCard: FunctionComponent<MediaCardProps> = ({ component, alt }) => {
  const [expanded, setExpanded] = useState(false);

  const [personalization, reducePersonalization] = usePersistentAppStore((state) => [
    state.personalization,
    state.reducePersonalization,
  ]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleImageSwitch = (imageId: string | undefined) => {
    const newPersonalizationOption = { component, imageId };
    setExpanded(false);
    reducePersonalization(newPersonalizationOption);
  };

  const id = personalization.filter((p) => p.component === component).find((subP) => alt || true);
  const maybeImageMetadata = KNOWN_IMAGES.find((is) => is.id === id?.imageId);
  if (!maybeImageMetadata) return null;

  const {
    src,
    tooltip,
    title,
    attributionHref: href,
    attributionText: source,
  } = maybeImageMetadata;

  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardMedia sx={{ height: 300 }} image={src} title={tooltip} />
      <CardActions disableSpacing>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            {title}
          </Typography>
          <Divider />
          <Typography variant="caption" color="text.secondary">
            Courtesy of <ExternalLink href={href}>{source}</ExternalLink>
          </Typography>
        </CardContent>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ChevronDown size={20} />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <Tooltip title="1-Click Clear Image—cannot be restored without a full reset">
              <IconButton size="small" aria-label="Clear">
                <X onClick={() => handleImageSwitch(undefined)} />
              </IconButton>
            </Tooltip>
            {KNOWN_IMAGES.map((item, index) =>
              id?.imageId !== item.id ? (
                <Tooltip title={item.id}>
                  <IconButton size="small" onClick={() => handleImageSwitch(item.id)}>
                    {index}
                  </IconButton>
                </Tooltip>
              ) : null,
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};
export default MediaCard;
