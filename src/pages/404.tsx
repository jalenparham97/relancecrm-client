import { useRouter } from 'next/router';
import { Container } from '@mantine/core';
import Button from '@/components/shared/Button';

export default function Error404() {
  const router = useRouter();

  return (
    <Container size="xl" className="pb-5">
      <div className="flex items-center flex-col justify-center lg:flex-row py-2 px-6 md:px-24 md:py-20 lg:py-32 lg:gap-28">
        <div className="w-full lg:w-1/2">
          <img className="hidden lg:block" src="/assets/img/404error.svg" alt="" />
          <img className="hidden md:block lg:hidden" src="/assets/img/404error.svg" alt="" />
          <img className="md:hidden" src="/assets/img/404error.svg" alt="" />
        </div>
        <div className="w-full lg:w-1/2">
          <h1 className="py-2 text-3xl lg:text-4xl font-extrabold text-gray-800">
            Looks like you've found the great doorway to nothing
          </h1>
          <p className="py-2 text-base text-gray-800">
            The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the
            link.
          </p>
          <p className="py-2 text-base text-gray-800">
            Sorry about that! Please check the URL in the address bar and try again.
          </p>
          <Button
            onClick={() => router.back()}
            size="xl"
            className="w-full lg:w-auto mt-4 text-base sm:px-16 py-5"
          >
            Go back
          </Button>
        </div>
      </div>
    </Container>
  );
}
