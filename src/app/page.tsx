import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {

  return (
    <div>
      <Link href={'models'}><Button className='block'>Pull a model</Button></Link>
      <Button>Create/Modify a model</Button>
    </div>
  );
}
