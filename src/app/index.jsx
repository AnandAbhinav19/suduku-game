import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

export default function App() {

  const [board, setBoard] = useState(puzzle.map(row => [...row]));

  const [selected, setSelected] = useState(null);

  const [mistakes, setMistakes] = useState(0);

  const [won, setWon] = useState(false);

  function selectCell(row, col) {
    setSelected([row, col]);
  }

  function enterNumber(num) {

    if (!selected || won) return;

    const [row, col] = selected;

    // Prevent changing original numbers
    if (puzzle[row][col] !== 0) return;

    const updatedBoard = board.map(r => [...r]);

    updatedBoard[row][col] = num;

    setBoard(updatedBoard);

    if (num !== solution[row][col]) {
      setMistakes(prev => prev + 1);
    }

    const completed = updatedBoard.every((r, i) =>
      r.every((value, j) => value === solution[i][j])
    );

    if (completed) {
      setWon(true);
    }
  }

  function resetGame() {
    setBoard(puzzle.map(row => [...row]));
    setSelected(null);
    setMistakes(0);
    setWon(false);
  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.heading}>SUDOKU</Text>

        <Text style={styles.subtitle}>
          Challenge Your Brain
        </Text>

        <View style={styles.info}>

          <Text style={styles.infoText}>
            Mistakes: {mistakes}
          </Text>

          <Text style={styles.infoText}>
            9 × 9 Grid
          </Text>

        </View>

        {/* Sudoku Board */}

        <View style={styles.board}>

          {board.map((row, rowIndex) => (

            <View key={rowIndex} style={styles.row}>

              {row.map((value, colIndex) => {

                const isSelected =
                  selected?.[0] === rowIndex &&
                  selected?.[1] === colIndex;

                const isOriginal =
                  puzzle[rowIndex][colIndex] !== 0;

                const isRelated =
                  selected !== null &&
                  (
                    selected[0] === rowIndex ||
                    selected[1] === colIndex ||
                    (
                      Math.floor(selected[0] / 3) === Math.floor(rowIndex / 3) &&
                      Math.floor(selected[1] / 3) === Math.floor(colIndex / 3)
                    )
                  );

                return (

                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.cell,

                      isRelated && styles.relatedCell,

                      isSelected && styles.selectedCell,

                      (colIndex + 1) % 3 === 0 &&
                      colIndex !== 8 && styles.rightBorder,

                      (rowIndex + 1) % 3 === 0 &&
                      rowIndex !== 8 && styles.bottomBorder,
                    ]}
                    onPress={() => selectCell(rowIndex, colIndex)}
                  >

                    <Text style={[
                      styles.cellText,
                      isOriginal && styles.originalText
                    ]}>
                      {value === 0 ? '' : value}
                    </Text>

                  </TouchableOpacity>

                );

              })}

            </View>

          ))}

        </View>

        {/* Number Pad */}

        <Text style={styles.label}>
          Select a Number
        </Text>

        <View style={styles.numberContainer}>

          {[1,2,3,4,5,6,7,8,9].map(num => (

            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => enterNumber(num)}
            >

              <Text style={styles.numberText}>
                {num}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

        {won && (
          <Text style={styles.winText}>
            🎉 Congratulations! Puzzle Solved!
          </Text>
        )}

        {/* Reset Button */}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetGame}
        >

          <Text style={styles.resetText}>
            Restart Game
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#101827',
  },

  content: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#94A3B8',
    marginTop: 5,
    marginBottom: 25,
  },

  info: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  infoText: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  board: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
  },

  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#64748B',
    backgroundColor: '#1E293B',
  },

  cellText: {
    color: '#38BDF8',
    fontSize: 17,
    fontWeight: '600',
  },

  originalText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  relatedCell: {
    backgroundColor: '#334155',
  },

  selectedCell: {
    backgroundColor: '#0369A1',
  },

  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#FFFFFF',
  },

  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },

  label: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 25,
    marginBottom: 15,
  },

  numberContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  numberButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  resetButton: {
    backgroundColor: '#F97316',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },

  resetText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  winText: {
    color: '#4ADE80',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },

});