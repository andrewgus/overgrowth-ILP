/**
 * Fisher-Yates Shuffle Algorith for shuffling arrays
 * @param array Any array
 * @returns Shuffled array
 */
function useShuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  export default useShuffleArray