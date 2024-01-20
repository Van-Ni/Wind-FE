import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonUser({ cards }) {
    const renderSkeletonCards = () =>
      Array(cards)
        .fill(0)
        .map((_, index) => (
          <Card
            key={index}
            sx={{ maxWidth: 345, borderRadius: '8px', marginBottom: '19.2px' }}
          >
            <CardHeader
              avatar={
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              }
              action={null}
              title={
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              }
              subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
          </Card>
        ));
  
    return <>{renderSkeletonCards()}</>;
  }
