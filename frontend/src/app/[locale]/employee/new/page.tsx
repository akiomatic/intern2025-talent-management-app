import { CreateEmployeeForm } from '@/components/CreateEmployeeForm';
import { routing } from '@/i18n/routing';
import { Container } from '@mui/material';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// ページ本体の定義
export default function CreateEmployeePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* 以前作成したフォームコンポーネントをここに配置します */}
      <CreateEmployeeForm />
    </Container>
  );
}