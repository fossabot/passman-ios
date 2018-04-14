import React, { Component } from 'react';
import {Alert} from 'react-native';
import { NavigationActions } from "react-navigation";
import ConnectionStore from '../stores/ConnectionStore';
import {
	StyledRootView, CenteredView, SettingsList, SettingsInput,
	SettingsListSeparator, SettingsButton, StyledActivityIndicator, Header
} from '../StyledComponents';
import DefaultColors from '../DefaultColors';
import {inject, observer} from 'mobx-react/native';
import {INavigationScreenProps} from '../../lib/Interfaces';

interface ILoginScreenProps extends INavigationScreenProps {
    style?: string;
    connectionStore?: ConnectionStore;
    masterPasswordStore?: masterPasswordStore;
}

@inject('connectionStore')
@inject('masterPasswordStore')
@observer
export default class LoginScreen extends Component<ILoginScreenProps, {}> {

    static navigationOptions = { title: 'Welcome', header: null };

    async componentWillMount() {
    	//await this.props.connectionStore.loadConnection();

    	// nextcloud credentials already saved?
	    const isConnectionSaved = this.props.connectionStore.isConnectionSaved;
	    if(isConnectionSaved) {
	    	console.log("Connection is Saved! -> Navigating to SetupMasterPasswordScreen");
	    	this.navigateFurther();
	    } else {
	    	console.log("Connection is not Saved!");
	    }
    }

    navigateFurther() {
    	let routeName = 'SetupMasterPasswordScreen';
    	if(this.props.masterPasswordStore.isMasterPasswordValid) routeName = 'LockScreen';
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: routeName})
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    async saveLoginData() {
        if(this.props.connectionStore.isConnectionValid) {
            if(await this.props.connectionStore.saveConnection(this.props.connectionStore.connection)) {
	            this.navigateFurther();
            } else {
            	Alert.alert("Credentials could not be saved! Try again!")
            }

        } else {
            Alert.alert("Credentials are not valid.")
        }
    }

    render() {
        return (
          <StyledRootView>
	          <Header />
	          <StyledActivityIndicator animating={this.props.connectionStore.isLoading} color={DefaultColors.darkGrey}/>
	          <SettingsList
	                button={
		                <CenteredView>
			                <SettingsButton
				                title="Next"
				                onPress={() => this.saveLoginData()}
			                />
		                </CenteredView>
	                }
	          >
		          <SettingsInput
			          label="Address"
		              placeholder="https://next.cloud.com"
			          keyboardType="url"
			          returnKeyType="next"
			          onChangeText={(url) => this.props.connectionStore.setConnectionInfo("url", url)}
		          />
		          <SettingsListSeparator />
		          <SettingsInput
			          label="Username"
			          placeholder="John Appleseed"
			          returnKeyType="next"
			          onChangeText={(username) => this.props.connectionStore.setConnectionInfo("username", username)}
		          />
		          <SettingsListSeparator />
		          <SettingsInput
			          secureTextEntry
			          label="Password"
			          placeholder="password"
			          returnKeyType="done"
			          onChangeText={(password) => this.props.connectionStore.setConnectionInfo("password", password)}
		          />
	          </SettingsList>
          </StyledRootView>
        );
    }
}