import { getGames } from '../../services/dataService';
import HomePage from './HomePage';

export async function homeLoader() {
  const posts = await getGames();
  return posts;
}

export default HomePage;
