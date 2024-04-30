import React, { useState } from 'react';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: "-----------------------------",
    secretAccessKey: "-----------------------------",
  },
});

interface AppProps {
  // Add any props here
}

interface AppState {
  textInput: string;
  file: File | null;
  formValid: boolean;
  dataSubmitted: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      textInput: '',
      file: null,
      formValid: true,
      dataSubmitted: false,
    };
  }

  handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ textInput: event.target.value });
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.setState({ file: files[0] });
    } else {
      this.setState({ file: null });
    }
  };

  handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!this.state.textInput || !this.state.file) {
      this.setState({ formValid: false });
      return;
    }
    if (!this.state.file) {
      console.error('No file selected.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsText(this.state.file);
      const s3Params = {
        Bucket: 'awscdkstack-fovuschallbucketa315c89c-30c00ouglzmi',
        Key: this.state.file.name,
        Body: this.state.file,
      };
      const s3Data = await s3Client.send(new PutObjectCommand(s3Params));

      const formData = new FormData();
      formData.append('inputText', this.state.textInput);
      formData.append('inputFileS3Path', `s3://${s3Params.Bucket}/${s3Params.Key}`);
      formData.append('fileName', this.state.file?.name);

      const dynamoDBData = await axios.post(
        'https://djqizw6zl5.execute-api.us-east-1.amazonaws.com/prod/save',
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Response:', dynamoDBData.data);
      this.setState({ textInput: '', file: null, formValid: true });

      console.log('File uploaded to S3:', s3Data);
      console.log('Data saved in DynamoDB:', dynamoDBData);
      this.setState({ dataSubmitted: true });
    } catch (error) {
      this.setState({ dataSubmitted: false });
      console.error('Error:', error);
    }
  };

  render() {
    return (
      <div className="h-screen flex justify-center items-center bg-indigo-200">
        <div className="bg-orange-200 p-8 shadow-md rounded-md w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-center">Fovus Code Challange</h1>
          <form onSubmit={this.handleFormSubmit}>
            <input
              type="text"
              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500 mb-4"
              placeholder="Input Text"
              value={this.state.textInput}
              onChange={this.handleTextChange} />
            <input
              type="file"
              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:border-orange-500 mb-4"
              onChange={this.handleFileChange} />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:bg-orange-700">
              Submit
            </button>
            {!this.state.formValid && <p className="text-red-500">Please fill in all fields</p>}
            {this.state.dataSubmitted && <p className="text-green-500">Data submitted succesfully.</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default App;