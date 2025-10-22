// المفتاح المستخدم في localStorage
const TUTORIAL_COMPLETED_KEY = 'agri_ai_tutorial_completed';

/**
 * التحقق مما إذا كانت هذه هي الزيارة الأولى للمستخدم
 * @returns {boolean} true إذا كانت الزيارة الأولى، false إذا كان المستخدم قد أكمل الدليل التعريفي من قبل
 */
export const isFirstVisit = (): boolean => {
  try {
    // إعادة إلى الحالة الأصلية
    return localStorage.getItem(TUTORIAL_COMPLETED_KEY) !== 'true';
  } catch (error) {
    // في حالة وجود مشكلة في الوصول إلى localStorage (مثل وضع الخصوصية في المتصفح)
    console.error('Error accessing localStorage:', error);
    return false;
  }
};

/**
 * تعيين أن المستخدم قد أكمل الدليل التعريفي
 */
export const markTutorialCompleted = (): void => {
  try {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * إعادة تعيين حالة الدليل التعريفي (لإظهاره مرة أخرى)
 */
export const resetTutorial = (): void => {
  try {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}; 