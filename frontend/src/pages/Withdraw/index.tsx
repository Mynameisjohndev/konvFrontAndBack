import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Bars from '../../assets/bars-solid.svg';
import Navbar from '../../Components/Navbar';
import { useContextApp } from '../../Context';
import {
  H1, ContainerAuth, InputContainer, Input, Button,
} from '../../global/styles/globals';
import api from '../../services';
import {
  Container, HeaderDashboard, Text, Content, IconNav, Row, AreaCard, FormOperation,
} from './styles';

const Withdraw = () => {
  const { user, setUser } = useContextApp();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (Number(value) < 0) {
      setValue('0');
    }
  }, [value]);

  const deposit = async () => {
    if (!value) {
      alert('Informe um valor para sacar');
    } else if (Number(value) > Number(user?.account_value)) {
      alert('Você não possui esse valor em conta');
    } else {
      const withdraw = await api.post(`/operations/withdraw/${user?.cpf}`, { value });
      if (withdraw.status === 200) {
        const valueAccount = Number(user?.account_value) - Number(value);
        if (user) {
          const newUser = { ...user, account_value: valueAccount };
          setUser(newUser);
          localStorage.setItem('token', JSON.stringify(newUser));
          navigate('/dashboard');
        }
      }
    }
  };

  return (
    <ContainerAuth>
      <Container>
      <HeaderDashboard>
        <Text>Faça seus saques</Text>
        </HeaderDashboard>
        <Content>
          <Row>

            {!open ? (
              <IconNav src={Bars} onClick={() => setOpen(true)}/>
            )
              : <Navbar open={open} setOpen={setOpen}/>
            }
            <AreaCard>
            <FormOperation>
              <InputContainer>
                  <Input placeholder='Valor: '
                    min={0}
                    value={value}
                    type="number"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </InputContainer>
                <Button onClick={deposit}>Sacar</Button>
              </FormOperation>
            </AreaCard>
            </Row>
        </Content>
      </Container>
    </ContainerAuth>
  );
};

export default Withdraw;
