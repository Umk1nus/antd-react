import { create } from 'zustand'
import { TElementType } from './types'

type TElementsState = {
  elements: TElementType[],
  addElement: (name: string, num: number) => void,
  deleteElement: (key: number) => void,
  updateElement: (name: string, num: number, key: number) => void
}

export const useElements = create<TElementsState>((set, get) => ({
  elements: [],
  addElement: (name, num) => set(state => {
    const lastElement = state.elements.slice(-1)
    const newElement = {name: name, num: num, date: new Date().getTime(), key: lastElement.length ? Number(lastElement[0].key) + 1 : 1}
    return {elements: [...state.elements, newElement]}
  }),
  updateElement: (name, num, key) => {
    const { elements } = get()
    set({
      elements: elements.map((element) => ({
          ...element,
          name: element.key === key ? name : element.name,
          num: element.key === key ? num : element.num,
      }))
  });
  },
  deleteElement: (key) => {
    const {elements} = get()
    set({
      elements: elements.filter(element => element.key !== key)
    })
  },
}))
