import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import t from 'tcomb-form-native';
import firebase from 'firebase';

state = {
  loggedIn: null,
  user: ''
};


// Do other things


class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome!',
  };
  componentDidMount() {
    const firebaseConfig = {
      //insert firebaseconfig here
    };

    //stop firebase from initializing twice 
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.email + ' is logged in' + user.uid);
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false });
        console.log('user logged off');

      }
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync2} />
        <Button title="Sign up!" onPress={this._signUpAsync} />
      </View>
    );
  }

  _signInAsync2 = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('SignIn2');
  };

  _signUpAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('SignUp');
  };
}



// SignInScreen
class SignInScreen2 extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };
  constructor(props) {
    super(props);
    this.state = ({
      email: '',
      Password: '',
      error: ''
    })
  }

  onButtonPress() {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;
    console.log('Logged in');
    this.props.navigation.navigate('SignedIn');

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          });
      });
  }
  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loading: false
    })
  }
  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false })
  }


  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Password "
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign in!" onPress={this.onButtonPress.bind(this)} />

      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('SignedIn');
  };


}


//SignUpScreen
class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign Up',
  };
  constructor(props) {
    super(props);
    this.state = ({
      email: '',
      Password: '',
    })
  }
  signup = (email, Password) => {
    try {
      firebase.auth().createUserWithEmailAndPassword(email, Password)
        .then(this.onLoginSuccess.bind(this))
        .catch((error) => {
          let errorCode = error.code
          let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            this.onLoginFailure.bind(this)('Weak password!')
          } else {
            this.onLoginFailure.bind(this)(errorMessage)
          }
        });
    }
    catch (error) {
      console.log(error.toString())
    }
    alert('signUp Successful');
    this._signInAsync2();
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Password "
          onChangeText={(Password) => this.setState({ Password })}
          value={this.state.password}
        />
        <Button title="Sign up!" onPress={() => this.signup(this.state.email, this.state.Password, this._signInAsync2)} />
      </View>
    );
  }

  _signInAsync2 = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('SignIn2');
  };
}
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  componentDidMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyBy98Cnc4cAnp5WdQI-P9iJ9sufot772Ec",
      authDomain: "modal-ddf99.firebaseapp.com",
      databaseURL: "https://modal-ddf99.firebaseio.com",
      projectId: "modal-ddf99",
      storageBucket: "modal-ddf99.appspot.com",
      messagingSenderId: "2652816594",
      appId: "1:2652816594:web:b0cdbc6cf357e1ecbf190b",
      measurementId: "G-698SEQ5056"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.email + ' is logged in' + user.uid);
        this.setState({ loggedIn: true });

      } else {
        this.setState({ loggedIn: false });
        console.log('user logged off');

      }
    })
  }


  render() {

    return (
      <View style={styles.container}>

        <Text>
          Hello {state.user.email}
        </Text>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Sign Off" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    firebase.auth().signOut();
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
        </Text>
        <Button title="Sign Off" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    firebase.auth().signOut();
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTextStyle: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'red'
  }
});

const AppStack = createStackNavigator({
  Home: SignInScreen,
  Other: OtherScreen,
  SignUp: SignUpScreen,
  SignIn2: SignInScreen2,
  SignedIn: HomeScreen
});
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )

);