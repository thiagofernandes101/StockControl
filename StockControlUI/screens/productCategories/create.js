import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as productCategoryValidations from '../../validations/ProductionCategoryFieldsValidation';
import baseUrl from '../../services/baseApiUrl';

export default function CreateProductCategory({ navigation }) {
    const [code, SetCode] = useState();
    const [description, SetDescription] = useState();

    async function SaveCategory() {
        let url = `${baseUrl}/category/new`;
        let productCategoryView = {
            code: code,
            description: description
        }

        if (productCategoryValidations.IsValid(productCategoryView)) {
            try {
                let result = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productCategoryView)
                });

                if (result.status == 200) {
                    Alert.alert("Sucesso", `Requisição feita com sucesso.\nDeseja cadastrar uma nova categoria?`, [
                        {
                            text: "Sim",
                            onPress: () => {
                                SetCode("");
                                SetDescription("");
                            }
                        },
                        {
                            text: "Não",
                            onPress: () => {
                                navigation.navigate("ProductsCategories");
                            }
                        }
                    ])
                }
                else {
                    let errorMessage = await result.json();
                    console.log(errorMessage.error);
                    Alert.alert("Erro", `${errorMessage.error}`, [
                        {
                            text: "OK",
                            onPress: () => {
                                SetCode("");
                                SetDescription("");
                            }
                        }
                    ])
                }
            }
            catch (error) {
                console.log(error);
                Alert.alert("Erro", `Ocorreu um erro inesperado.\nVerifique o arquivo de log.`, [
                    {
                        text: "OK",
                        onPress: () => {
                            SetCode("");
                            SetDescription("");
                        }
                    }
                ])
            }
        }
        else {
            Alert.alert("Erro", `Verifique se os campos obrigatórios código e descrição foram preenchidos corretamente.`, [
                {
                    text: "OK"
                }
            ])
        }
    }

    return (
        <View style={[styles.container]}>
            <View>
                <View style={[styles.titleGroup]}>
                    <Text style={[styles.title]}>Nova categoria</Text>
                </View>
                <View style={[styles.formGroup]}>
                    <TextInput
                        style={[styles.textInput]}
                        placeholder="Código (obrigatório)"
                        onChangeText={(value) => SetCode(value)}
                        value={code}
                        keyboardType="numeric"></TextInput>
                </View>
                <View style={[styles.formGroup]}>
                    <TextInput
                        style={[styles.textInput]}
                        placeholder="Descrição (obrigatório)"
                        onChangeText={(value) => SetDescription(value)}
                        value={description}></TextInput>
                </View>
            </View>
            <View style={[styles.formGroupDirection]}>
                <Button title='Salvar' color={"#008000"} onPress={() => SaveCategory()}></Button>
                <Button title='Cancelar' color={"#FF0000"} onPress={() => navigation.navigate("ProductsCategories")}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20
    },
    textInput: {
        borderBottomWidth: 1,
        padding: 5,
    },
    formGroupDirection: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    formGroup: {
        marginBottom: 30
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30
    },
    titleGroup: {
        marginBottom: 30,
        alignItems: 'center'
    }
})