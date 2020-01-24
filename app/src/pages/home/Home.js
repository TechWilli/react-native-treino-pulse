import React from 'react'
import { View, Text, Button, Image } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setLoginFlag } from 'redux-config/Actions'
import LogoResight from '../../assets/images/resight_logo.png'

const MainView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`
const TextView = styled.View`
    width: 80%;
`
const StyledText = styled.Text`
    margin-top: ${props => props.marginTop ? props.marginTop : 0} ;
    font-size: 20;
    text-align: center;
    color: #FFFFFF;
`
const ButtonView = styled.View`
    margin-bottom: 30;
`

const Home = (props) => {
    const resetLoginFlag = () => {
        props.reduxSetLoginFlag(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#333333' }}>
            <MainView>
            <Image 
                source={LogoResight}
                style={{width: '20%', height: '20%', marginBottom: 50}}
            />
                <TextView>
                    <StyledText>Para começar abra o arquivo Home.js que se encontra em src/pages/home/Home.js</StyledText>
                    <StyledText marginTop={50} >"O texto aqui foi alterado :D"</StyledText>
                </TextView>
            </MainView>
            {/* <ButtonView>
                <Button
                    title="Resetar"
                    onPress={resetLoginFlag}
                />
            </ButtonView> */}
        </View>
    );
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        reduxSetLoginFlag: (flag) => dispatch(setLoginFlag(flag)),
    }
};

const mapStateToProps = (state) => {
    return {
        loggedFlag: state.Reducer.logged,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);