import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { Provider } from 'react-redux';
import swaggerStore from '../store/swaggerStore'; 

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <Provider store={swaggerStore}>
      <SwaggerUI url="/api/docs" />
    </Provider>
  );
}
