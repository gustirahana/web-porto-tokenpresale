import { Helmet } from 'react-helmet';

interface BreadcrumbItemProps {
  mainTitle: string;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ mainTitle }) => {
  return (
    <Helmet>
      <title>{mainTitle} — SP ADST</title>
    </Helmet>
  );
};

export default BreadcrumbItem;
