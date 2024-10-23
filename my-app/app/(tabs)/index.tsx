import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const Game2048 = () => {
  // Initialize the grid with a 5 by 4 matrix (2D array)
  const initialGrid = Array(5).fill(null).map(() => Array(4).fill(0));
  const [grid, setGrid] = useState(initialGrid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Function to generate a random number (2 or 4)
  const generateRandomNumber = () => {
    return Math.random() < 0.9 ? 2 : 4;
  };

  // Function to randomly place a number in an empty spot
  const placeRandomNumber = (newGrid) => {
    const emptyTiles = [];
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (newGrid[i][j] === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }
    if (emptyTiles.length === 0) return newGrid; // No empty tiles, return unchanged grid

    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    newGrid[randomTile.row][randomTile.col] = generateRandomNumber();
    return newGrid;
  };

  // Initialize the game
  const startGame = () => {
    let newGrid = [...initialGrid];
    newGrid = placeRandomNumber(newGrid);
    newGrid = placeRandomNumber(newGrid);
    setGrid(newGrid);
    setScore(0);
  };

  useEffect(() => {
    startGame();
  }, []);

  // Function to handle swipe gestures
  const handleSwipe = (direction) => {
    let newGrid = [...grid];

    switch (direction) {
      case 'up':
        newGrid = swipeUp(newGrid);
        break;
      case 'down':
        newGrid = swipeDown(newGrid);
        break;
      case 'left':
        newGrid = swipeLeft(newGrid);
        break;
      case 'right':
        newGrid = swipeRight(newGrid);
        break;
      default:
        return;
    }

    // Only place a new number if the grid changed
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      newGrid = placeRandomNumber(newGrid);
      setGrid(newGrid);
      checkGameOver(newGrid);
    }
  };

  // Check if the game is over
  const checkGameOver = (newGrid) => {
    const hasMovesLeft = newGrid.some((row) => row.includes(0)); // Check if any empty tiles
    if (!hasMovesLeft) {
      Alert.alert('Game Over', 'You have no more moves left.');
    }
  };

  // Swipe logic functions (merge logic, shifts, and summing)
  const swipeLeft = (newGrid) => {
    for (let i = 0; i < newGrid.length; i++) {
      let row = newGrid[i].filter(val => val); // Get all non-zero values in the row

      // Merge identical values
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          setScore(prevScore => prevScore + row[j]); // Update score
          row[j + 1] = 0; // Mark next tile as empty after merge
        }
      }

      // Filter out zeroes and push them to the right
      row = row.filter(val => val);
      while (row.length < newGrid[i].length) {
        row.push(0); // Fill the rest with zeroes
      }

      newGrid[i] = row; // Update the grid with the new row
    }

    return newGrid;
  };

  const swipeRight = (newGrid) => {
    for (let i = 0; i < newGrid.length; i++) {
      let row = newGrid[i].filter(val => val); // Get all non-zero values in the row
      row.reverse(); // Reverse the row to merge from the right

      // Merge identical values
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          setScore(prevScore => prevScore + row[j]); // Update score
          row[j + 1] = 0; // Mark next tile as empty after merge
        }
      }

      // Filter out zeroes and push them to the left
      row = row.filter(val => val);
      while (row.length < newGrid[i].length) {
        row.push(0); // Fill the rest with zeroes
      }

      row.reverse(); // Reverse the row back
      newGrid[i] = row; // Update the grid with the new row
    }

    return newGrid;
  };

  const swipeUp = (newGrid) => {
    for (let col = 0; col < newGrid[0].length; col++) {
      let column = [];
      for (let row = 0; row < newGrid.length; row++) {
        if (newGrid[row][col] !== 0) column.push(newGrid[row][col]); // Get non-zero values
      }

      // Merge identical values
      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          setScore(prevScore => prevScore + column[j]); // Update score
          column[j + 1] = 0; // Mark next tile as empty after merge
        }
      }

      // Filter out zeroes and push them to the bottom
      column = column.filter(val => val);
      while (column.length < newGrid.length) {
        column.push(0); // Fill the rest with zeroes
      }

      for (let row = 0; row < newGrid.length; row++) {
        newGrid[row][col] = column[row]; // Update the grid with the new column
      }
    }

    return newGrid;
  };

  const swipeDown = (newGrid) => {
    for (let col = 0; col < newGrid[0].length; col++) {
      let column = [];
      for (let row = 0; row < newGrid.length; row++) {
        if (newGrid[row][col] !== 0) column.push(newGrid[row][col]); // Get non-zero values
      }

      // Merge identical values
      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          setScore(prevScore => prevScore + column[j]); // Update score
          column[j + 1] = 0; // Mark next tile as empty after merge
        }
      }

      // Filter out zeroes and push them to the top
      column = column.filter(val => val);
      while (column.length < newGrid.length) {
        column.push(0); // Fill the rest with zeroes
      }

      column.reverse(); // Reverse the column back
      for (let row = 0; row < newGrid.length; row++) {
        newGrid[row][col] = column[row]; // Update the grid with the new column
      }
    }

    return newGrid;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Title and Scores Section */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.gameTitle}>2048</Text>
          </View>
          <View style={styles.scoresContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>BEST SCORE</Text>
              <Text style={styles.scoreValue}>{bestScore}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.controlButton} onPress={startGame}>
          <Text style={styles.control}>🔄</Text>
        </TouchableOpacity>

        <View style={styles.designtext}>
          <Text style={styles.headertext}>Swipe to Play</Text>
        </View>

        {/* Game Grid */}
        <PanGestureHandler
          onGestureEvent={(e) => {
            const { translationX, translationY } = e.nativeEvent;
            if (Math.abs(translationX) > Math.abs(translationY)) {
              if (translationX > 0) handleSwipe('right');
              else handleSwipe('left');
            } else {
              if (translationY > 0) handleSwipe('down');
              else handleSwipe('up');
            }
          }}
        >
          <View style={styles.grid}>
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((cell, cellIndex) => (
                  <View key={cellIndex} style={styles.cell}>
                    <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#faf8ef',
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreBox: {
    backgroundColor: '#bbada0',
    padding: 10,
    borderRadius: 5,
  },
  scoreText: {
    color: '#f9f6f2',
    fontSize: 12,
    textAlign: 'center',
  },
  scoreValue: {
    color: '#f9f6f2',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 75,
    height: 75,
    backgroundColor: '#cdc1b4',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  cellText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  controlButton: {
    alignSelf: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffcc00',
    borderRadius: 10,
  },
  control: {
    fontSize: 28,
  },
  designtext: {
    marginVertical: 10,
    alignItems: 'center',
  },
  headertext: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Game2048;
