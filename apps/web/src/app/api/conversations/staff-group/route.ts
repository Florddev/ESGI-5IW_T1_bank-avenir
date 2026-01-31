import { successResponse, errorResponse } from '@workspace/adapter-next/utils/api.helpers';
import { container } from '@/lib/di';
import { GetOrCreateStaffGroupChatUseCase } from '@workspace/application/use-cases';

const getUseCase = () => container.resolve(GetOrCreateStaffGroupChatUseCase);

export async function GET() {
  try {
    const result = await getUseCase().execute();
    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
