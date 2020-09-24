import React from 'react';
import { StyleSheet, ScrollView, View, Picker } from 'react-native';
import { Text, Card, ThemeProvider } from 'react-native-elements';
import Input from './Input';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weightUnit: 'lb',
      bars: {
        "Safety Squat Bar": 47,
        "StrongArm Power Bar": 45,
      },
      barSelected: "Safety Squat Bar",
      platePairsAvg: [
        58.5, 56.5, 50.75, 50.5, 50.5,
        32.75, 21, 21, 20, 13, 12.25,
        10, 5, 4.5, 0.625, 0.625
      ],
      targetWeight: 47,
      combination: [],
      combinationWeight: -1,
    }
  }

  componentDidMount() {
    this.updateCombination()
  }

  render() {
    const { barSelected, bars } = this.state;
    return (
      <ThemeProvider style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Card
            key='targetweight-input'
            title={`Weight (${this.state.weightUnit})`}
            style={styles.inputView}
          >
            <Picker
              selectedValue={barSelected}
              onValueChange={(itemValue) => {
                this.updateBarWeight(itemValue);
              }}
            >
              {
                Object.keys(bars).map((barName) => (
                  <Picker.Item key={barName} label={barName} value={barName} />
                ))
              }
            </Picker>
            <Input
              onChangeText={this.updateCombination.bind(this)}
            />
          </Card>

          <this.CombinationInfo key='combinfo' /> 
        </ScrollView>
      </ThemeProvider>
    );
  }

  CombinationInfo = () => {
    if (this.state.combinationWeight !== this.state.barWeight) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Card title="Combination" innerStyle={{ flexDirection: 'row' }}>
            {this.state.combination.map((plateWeight, i) => (
              <Text key={plateWeight+i} style={{ fontSize: 25 }}>
                {plateWeight} <Italic>{this.state.weightUnit}</Italic>
              </Text>)
            )}
          </Card>

          <Card title="Error" style={{ flex: 1 }}>
            <Text style={{ fontStyle: "italic", marginTop: "3%", fontSize: 30 }}>
              {Number(this.state.combinationWeight - this.state.targetWeight).toFixed(2)} {this.state.weightUnit}
            </Text>
          </Card>
        </View>
      );
    } else {
      return null;
    }
  }

  updateBarWeight = (barSelected) => {
    const { targetWeight } = this.state;
    this.setState({
      barSelected,
    });
    setTimeout(() => {
      this.updateCombination(targetWeight);
    }, 0);
  }

  updateCombination(targetWeight) {
    const { barSelected, bars } = this.state;
    const barWeight = bars[barSelected];

    const allCombinations = this.getAllSubsets(this.state.platePairsAvg)
    let lowestError = -1
    let lowestErrorWeight = -1
    let lowestErrorComb = null

    for (index in allCombinations) {
      let comb = allCombinations[index]
      let netWeight = barWeight + 2*comb.reduce((a, b) => a+b,0)
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

const Italic = (props) => <Text style={{ fontStyle: 'italic' }}>{props.children}</Text>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputView: {
    flex: 1,
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

