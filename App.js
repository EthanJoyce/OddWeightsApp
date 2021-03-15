import React from 'react';
import { StyleSheet, ScrollView, View, Picker, CheckBox } from 'react-native';
import { Text, Card, ThemeProvider } from 'react-native-elements';
import Input from './Input';

const AD_ACCURACY = 4; // Number of decimal places to round to. Fix/hack for duplicate plate entry selection

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weightUnit: 'lb',
      bars: {
        "StrongArm Power Bar": 43.5,
        "Safety Squat Bar": 47,
        "EZ Curl Bar": 17.5,
      },
      barSelected: "StrongArm Power Bar",
      platePairsAvg: [
        58.5, 56.5, 50.75, 50.5, 50.50001, 44.5,
        32.75, 25.5, 21, 21.00001, 20, 13, 12.25,
        10, 5, 4.5, 2.5, 0.625, 0.62501,
      ],
      platePairsAvgSaved: [],
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
            style={styles.inputView}
          >
            <Card.Title>
              <Text style={styles.bold}>
                Weight ({this.state.weightUnit})
              </Text>
            </Card.Title>
            <Card.Divider />

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

  truncate (num, places) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

  CombinationInfo = () => {
    const {
      combination,
      combinationWeight,
      targetWeight,
      weightUnit,
      platePairsAvgSaved,
      platePairsAvg,
    } = this.state;

    return (
      <View style={{ flexDirection: 'row' }}>
        <Card innerStyle={{ flexDirection: 'row' }}>
          <Card.Title><Text style={styles.bold}>Combination</Text></Card.Title>
          <Card.Divider />
          {
            combination.map((plateWeight, i) => (
              <View
                key={`platepair-row-${i}-${plateWeight}`}
                style={{ flexDirection: 'row' }}
              >
                <CheckBox
                  value={platePairsAvgSaved.indexOf(plateWeight) > -1}
                  onValueChange={(checked) => {
                    if (checked) {
                      // Add to saved list
                      platePairsAvgSaved.push(plateWeight);

                      // Remove from available plates (prevents duplicates)
                      const index = platePairsAvg.indexOf(plateWeight);
                      if (index > -1) {
                        platePairsAvg.splice(index, 1);
                      }
                    } else {
                      // Remove from list
                      const index = platePairsAvgSaved.indexOf(plateWeight);
                      if (index > -1) {
                        platePairsAvgSaved.splice(index, 1);
                      }

                      // Add back to original
                      platePairsAvg.push(plateWeight);
                    }

                    // Sort plates so largest show up first always
                    platePairsAvg.sort((a,b) => (a-b));

                    this.setState({
                      platePairsAvgSaved,
                      platePairsAvg,
                    });
                  }}
                />
                <Text
                  key={plateWeight+i}
                  style={{ fontSize: 25 }}
                >
                  { this.truncate(plateWeight, AD_ACCURACY) } <Italic>{ weightUnit }</Italic>
                </Text>
              </View>
            ))
          }
        </Card>

        <Card style={{ flex: 1 }}>
          <Card.Title><Text style={styles.bold}>Error</Text></Card.Title>
          <Card.Divider />
          <Text style={{ fontStyle: "italic", marginTop: "3%", fontSize: 30 }}>
            {
              Number(combinationWeight - targetWeight).toFixed(2)
            } { weightUnit }
          </Text>
        </Card>
      </View>
    );
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
    const {
      barSelected,
      bars,
      platePairsAvg,
      platePairsAvgSaved,
    } = this.state;
    const barWeight = bars[barSelected];

    const allCombinations = this.getAllSubsets(platePairsAvg, platePairsAvgSaved);

    let lowestError = -1;
    let lowestErrorWeight = -1;
    let lowestErrorComb = null;

    for (index in allCombinations) {
      let comb = allCombinations[index];
      let netWeight = barWeight + 2*comb.reduce((a, b) => a+b,0);
      netWeight = netWeight.toFixed(AD_ACCURACY); // Conf. decimal place accuracy to allow for anti-duplicate fix/hack
      
      let absError = Math.abs(targetWeight - netWeight);

      if (absError < lowestError || lowestErrorComb === null) {
        lowestError = absError;
        lowestErrorWeight = netWeight;
        lowestErrorComb = comb;

        lowestErrorComb.sort((a, b) => (a - b));
      }
    }

    this.setState({
      targetWeight: targetWeight,
      combination: lowestErrorComb,
      combinationWeight: lowestErrorWeight,
    })

    return lowestErrorComb;
  }

  getAllSubsets(theArray, requiredVals) { // Helper function
    const allSubsets = theArray.reduce(
      (subsets, value) => (
        subsets.concat(
          subsets.map(set => [value, ...set])
        )
      ),
      [requiredVals],
    );

    return allSubsets;
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
  },
  bold: {
    fontWeight: 'bold',
  },
});

