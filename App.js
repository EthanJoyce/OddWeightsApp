import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Input from './Input.js';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      barWeight: 47,
      platePairsAvg: [ 58.5, 56.5, 50.75, 32.75,
                          13, 12.25,
                          5, 4.5, 0.625, 0.625 ],
      targetWeight: 47,
      combination: [],
      combinationWeight: -1,
    }
  }

  componentDidMount() {
    this.updateCombination()
  } 

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputView}>
          <Text style={{ fontSize: 25 }}> Weight: </Text>
          <Input
            onChangeText={this.updateCombination.bind(this)}
          />
        </View>

        <this.CombinationInfo /> 
      </ScrollView>
    );
  }

  CombinationInfo = () => {
    if (this.state.combinationWeight !== this.state.barWeight) {
      return (
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 25, marginTop: "3%" }}>Combination:</Text>

          {this.state.combination.map((plateWeight, i) => (
            <Text style={{ fontSize: 25 }}>{plateWeight}</Text>)
          )}

          <Text style={{ fontStyle: "italic", marginTop: "3%", fontSize: 30 }}>
            Error: {Number(this.state.combinationWeight - this.state.targetWeight).toFixed(2)}
          </Text>
        </View>
      );
    } else {
      return (<Text>No information to display</Text>);
    }
  }

  updateCombination(targetWeight) {
    const allCombinations = this.getAllSubsets(this.state.platePairsAvg)
    let lowestError = -1
    let lowestErrorWeight = -1
    let lowestErrorComb = null

    for (index in allCombinations) {
      let comb = allCombinations[index]
      let netWeight = this.state.barWeight + 2*comb.reduce((a, b) => a+b,0)
      let absError = Math.abs(targetWeight - netWeight)

      if (absError < lowestError || lowestErrorComb === null) {
        lowestError = absError
        lowestErrorWeight = netWeight
        lowestErrorComb = comb
      }
    }

    this.setState({
      targetWeight: targetWeight,
      combination: lowestErrorComb,
      combinationWeight: lowestErrorWeight,
    })

    return lowestErrorComb;
  }

  getAllSubsets(theArray) { // Helper function
      return theArray.reduce(
          (subsets, value) => subsets.concat(
            subsets.map(set => [value, ...set])
          ),
          [[]]
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

