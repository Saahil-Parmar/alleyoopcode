const API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1';

export interface ExerciseResult {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export async function searchExercises(query: string): Promise<ExerciseResult[]> {
  try {
    const response = await fetch(
      `${API_NINJAS_BASE_URL}/exercises?name=${encodeURIComponent(query)}`,
      {
        headers: {
          'X-Api-Key': 'rXSXRIqzOy7yXtqRCjCWgQ==yjMwa2JRCa6lGwRK',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data: ExerciseResult[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching exercises:', error);
    return [];
  }
} 