/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';

type ListProps = {
    list: Array<any>
}

export const List : NextPage<ListProps> = ({list}) =>{
    return (
        <div className='container-list'>
            {
                list && list.length > 0 
                ? list.map(i => <p key={i._id}>{i.name}</p>) 
                :
                    <>
                        <img src="/empty.svg" alt='Nenhum registro encontrado'/>
                        <p>Você ainda não possui tarefas cadastradas!</p>
                    </>
            }
        </div>
    );
}