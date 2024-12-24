import React from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const App: React.FC = () => (
  <Provider store={store}>
    <div className='flex gap-6 items-center p-3'>
      <span>Buttons</span>
      <Button>Submit</Button>
      <Button disabled size='sm'>
        Disabled
      </Button>
      <Button variant='destructive' size='lg'>
        Delete
      </Button>
      <Button variant='outline'>Button</Button>
    </div>
    <div className='flex gap-6 items-center p-3'>
      <span>Input</span>
      <Input placeholder='Input' />
      <Input placeholder='Input' disabled />
      <Input placeholder='Input' hasError />
    </div>
  </Provider>
);

export default App;
