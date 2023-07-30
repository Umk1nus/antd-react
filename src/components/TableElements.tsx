import { Button, Table, Modal, Input, InputNumber} from 'antd';
import type { ColumnsType, ColumnGroupType } from 'antd/es/table';
import style from './TableElements.module.css'
import { Actions, TElementType } from '../types';
import { useElements } from '../store';
import { useState, useEffect } from 'react'

const TableElements = () => {

  const elementsStore = useElements()
  const [currentAction, setCurrentAction] = useState(Actions.Add)
  const [currentKey, setCurrentKey] = useState<number|null>()
  const [inputName, setInputName] = useState('')
  const [inputNum, setInputNum] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [currentArray, setCurrentArray] = useState<TElementType[]>([])


  useEffect(() => {
    if (searchInput) {
      setCurrentArray(elementsStore.elements.filter((element) => {
        return element.name.split(' ').find(name => name.toLowerCase() === searchInput) || String(element.num) === searchInput
      }))
    } else setCurrentArray(elementsStore.elements)
  }, [searchInput, elementsStore])

  useEffect(() => {
    if (!modalVisible) {
      setInputName('')
      setInputNum('')
      currentAction === Actions.Update && setCurrentAction(Actions.Add)
    }
  }, [modalVisible])

  const columns: ColumnGroupType<TElementType> | ColumnsType<TElementType> = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      sorter: (a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        return 0
      }
    },
    {
      title: 'Дата',
      key: 'date',
      sorter: (a, b) => a.date - b.date,
      render: (_, {date}) => (
        <>{String(new Date(date).toLocaleTimeString())} - {String(new Date(date).toLocaleDateString())}</>
      )
    },
    {
      title: 'Число',
      dataIndex: 'num',
      key: 'num',
      sorter: (a, b) => a.num - b.num,
    },
    {
      title: 'Действие',
      key: 'action',
      width: '20%',
      render: (_, {key, name, num}) => (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <Button onClick={() => updateModal(name, String(num), Number(key))}>Редактировать</Button>
          <Button onClick={() => elementsStore.deleteElement(Number(key))}>Удалить</Button>
        </div>
      )
    }
  ];

  const addElement = () => {
    if (inputName.length) {
      elementsStore.addElement(inputName, Number(inputNum))
      setInputName('')
      setInputNum('')
      setModalVisible(false)
    }
  }

  const updateElement = () => {
    elementsStore.updateElement(inputName, Number(inputNum), Number(currentKey))
    setModalVisible(false)
  }

  const updateModal = (name: string, num: string, key: number) => {
    setInputName(name)
    setInputNum(num)
    setModalVisible(true)
    setCurrentAction(Actions.Update)
    setCurrentKey(key)
  }

  return (
    <>
      <header className={style.header}>
        <Input className={style.header__search} placeholder='Поиск...' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
        <Button type="primary" onClick={() => setModalVisible(true)}>Добавить элемент</Button>
      </header>
      <Table columns={columns} dataSource={currentArray} pagination={false}/>
      <Modal title={currentAction === Actions.Add ? 'Добавить элемент' : 'Обновить элемент'} open={modalVisible} onCancel={() => setModalVisible(false)} onOk={currentAction === Actions.Add ? addElement : updateElement}>
        <Input value={inputName} placeholder="Введите имя" onChange={(e) => setInputName(e.target.value)}/>
        <InputNumber
          placeholder='Введите число'
          style={{width: '100%', marginTop: '10px'}}
          value={inputNum}
          onChange={(value) => setInputNum(String(value))}
        />
      </Modal>
    </>
  )
}

export default TableElements