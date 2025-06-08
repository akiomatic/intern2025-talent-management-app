import { CreateEmployeeForm } from '@/components/CreateEmployeeForm';
import { Container } from '@mui/material';

// ページ本体の定義
export default function CreateEmployeePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* 以前作成したフォームコンポーネントをここに配置します */}
      <CreateEmployeeForm />
    </Container>
  );
}