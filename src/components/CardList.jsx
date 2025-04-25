import React from 'react';
import { Card } from './Card';

export const CardList = () => {
    // Datos estáticos para desarrollo
    const staticItems = [
        {
            id: 1,
            title: "Luke Skywalker",
            description: "Joven de Tatooine que se convierte en un héroe de la Alianza Rebelde",
            image: "https://placehold.co/600x400?text=Luke+Skywalker"
        },
        {
            id: 2,
            title: "Darth Vader",
            description: "El temido Lord Sith y padre de Luke Skywalker",
            image: "https://placehold.co/600x400?text=Darth+Vader"
        },
        {
            id: 3,
            title: "Princesa Leia",
            description: "Princesa de Alderaan y líder de la Alianza Rebelde",
            image: "https://placehold.co/600x400?text=Princesa+Leia"
        },
        {
            id: 4,
            title: "Han Solo",
            description: "Contrabandista y capitán del Halcón Milenario",
            image: "https://placehold.co/600x400?text=Han+Solo"
        },
        {
            id: 5,
            title: "Chewbacca",
            description: "Copiloto wookiee del Halcón Milenario y amigo leal de Han Solo",
            image: "https://placehold.co/600x400?text=Chewbacca"
        },
        {
            id: 6,
            title: "Yoda",
            description: "Antiguo Gran Maestro de la Orden Jedi",
            image: "https://placehold.co/600x400?text=Yoda"
        },
        {
            id: 1,
            title: "Luke Skywalker",
            description: "Joven de Tatooine que se convierte en un héroe de la Alianza Rebelde",
            image: "https://placehold.co/600x400?text=Luke+Skywalker"
        },
        {
            id: 2,
            title: "Darth Vader",
            description: "El temido Lord Sith y padre de Luke Skywalker",
            image: "https://placehold.co/600x400?text=Darth+Vader"
        },
        {
            id: 3,
            title: "Princesa Leia",
            description: "Princesa de Alderaan y líder de la Alianza Rebelde",
            image: "https://placehold.co/600x400?text=Princesa+Leia"
        },
    ];

    return (
        <div className="container mt-4">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
                {staticItems.map((item, index) => (
                    <div className="col" key={item.id || index}>
                        {/* Pasa los datos del item como props a la Card */}
                        <Card 
                            title={item.title} 
                            text={item.description} 
                            imageUrl={item.image} 
                            id={item.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};