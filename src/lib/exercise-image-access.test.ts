import { describe, it, expect } from 'vitest';
import { exerciseImagePath } from './exercise-image-access';
const backend = 'https://cloud.example.test';
describe('private exercise image paths', () => {
  it('supports existing public links without continuing public access', () => {
    expect(exerciseImagePath(`${backend}/storage/v1/object/public/exercise-uploads/user/image.jpg`, backend)).toBe('user/image.jpg');
  });
  it('removes expiring signature URLs before persistence', () => {
    expect(exerciseImagePath(`${backend}/storage/v1/object/sign/exercise-uploads/user/image.jpg?token=temporary`, backend)).toBe('user/image.jpg');
  });
  it('keeps paths resolvable', () => { expect(exerciseImagePath('user/image.jpg', backend)).toBe('user/image.jpg'); });
  it('does not reinterpret external images as local storage', () => {
    expect(exerciseImagePath('https://external.test/storage/v1/object/public/exercise-uploads/user/image.jpg', backend)).toBeNull();
  });
});