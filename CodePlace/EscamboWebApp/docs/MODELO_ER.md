# 🗄️ Modelo Entidade-Relacionamento – Escambo

## Diagrama ER

```
┌─────────────────────┐       ┌─────────────────────┐
│       users          │       │        ads           │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ name                │       │ title               │
│ email (UNIQUE)      │       │ image_url           │
│ phone               │       │ redirect_url        │
│ password_hash       │       │ duration_seconds    │
│ avatar_url          │       │ is_active           │
│ created_at          │       │ impressions         │
│ updated_at          │       │ clicks              │
└────────┬────────────┘       │ created_at          │
         │                    │ updated_at          │
         │ 1:N                └─────────────────────┘
         │
         ▼
┌─────────────────────┐
│       items          │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK→users)  │
│ title               │
│ description         │
│ category            │
│ condition           │
│ status              │
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│       photos         │
├─────────────────────┤
│ id (PK)             │
│ item_id (FK→items)  │
│ url                 │
│ is_primary          │
│ order               │
│ created_at          │
└─────────────────────┘


┌─────────────────────┐
│       likes          │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK→users)  │  ← Quem curtiu
│ item_id (FK→items)  │  ← Item curtido
│ created_at          │
└─────────────────────┘
  UNIQUE(user_id, item_id)


┌─────────────────────┐
│      matches         │
├─────────────────────┤
│ id (PK)             │
│ user_1_id (FK→users)│
│ user_2_id (FK→users)│
│ item_1_id (FK→items)│  ← Item do user_1 curtido por user_2
│ item_2_id (FK→items)│  ← Item do user_2 curtido por user_1
│ status              │  ← 'active', 'closed'
│ ad_shown            │  ← boolean (anúncio já foi exibido)
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│     messages         │
├─────────────────────┤
│ id (PK)             │
│ match_id (FK→matches)│
│ sender_id (FK→users)│
│ content             │
│ read_at             │
│ created_at          │
└─────────────────────┘
```

## Relacionamentos

| Relação              | Tipo | Descrição                                         |
| -------------------- | ---- | ------------------------------------------------- |
| users → items        | 1:N  | Um usuário pode ter vários itens                  |
| items → photos       | 1:N  | Um item pode ter várias fotos                     |
| users → likes        | 1:N  | Um usuário pode curtir vários itens               |
| items → likes        | 1:N  | Um item pode receber várias curtidas              |
| users → matches      | 1:N  | Um usuário participa de vários matches (como user_1 ou user_2) |
| matches → messages   | 1:N  | Um match tem várias mensagens de chat             |
| users → messages     | 1:N  | Um usuário envia várias mensagens                 |

## Detalhamento das Colunas

### `users`
| Coluna        | Tipo         | Restrições             |
| ------------- | ------------ | ---------------------- |
| id            | INT          | PK, AUTO_INCREMENT     |
| name          | VARCHAR(100) | NOT NULL               |
| email         | VARCHAR(150) | NOT NULL, UNIQUE       |
| phone         | VARCHAR(20)  | NOT NULL               |
| password_hash | VARCHAR(255) | NOT NULL               |
| avatar_url    | VARCHAR(500) | NULL                   |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at    | TIMESTAMP    | ON UPDATE CURRENT_TIMESTAMP |

### `items`
| Coluna      | Tipo                                      | Restrições             |
| ----------- | ----------------------------------------- | ---------------------- |
| id          | INT                                       | PK, AUTO_INCREMENT     |
| user_id     | INT                                       | FK → users.id, NOT NULL |
| title       | VARCHAR(200)                              | NOT NULL               |
| description | TEXT                                      | NULL                   |
| category    | VARCHAR(50)                               | NOT NULL               |
| condition   | ENUM('novo','seminovo','usado','antigo')  | NOT NULL               |
| status      | ENUM('active','traded','inactive')        | DEFAULT 'active'       |
| created_at  | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP                                 | ON UPDATE CURRENT_TIMESTAMP |

### `photos`
| Coluna     | Tipo         | Restrições             |
| ---------- | ------------ | ---------------------- |
| id         | INT          | PK, AUTO_INCREMENT     |
| item_id    | INT          | FK → items.id, NOT NULL |
| url        | VARCHAR(500) | NOT NULL               |
| is_primary | BOOLEAN      | DEFAULT false          |
| `order`    | INT          | DEFAULT 0              |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |

### `likes`
| Coluna     | Tipo      | Restrições                       |
| ---------- | --------- | -------------------------------- |
| id         | INT       | PK, AUTO_INCREMENT               |
| user_id    | INT       | FK → users.id, NOT NULL          |
| item_id    | INT       | FK → items.id, NOT NULL          |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP        |
| —          | —         | UNIQUE INDEX(user_id, item_id)   |

### `matches`
| Coluna     | Tipo                       | Restrições             |
| ---------- | -------------------------- | ---------------------- |
| id         | INT                        | PK, AUTO_INCREMENT     |
| user_1_id  | INT                        | FK → users.id          |
| user_2_id  | INT                        | FK → users.id          |
| item_1_id  | INT                        | FK → items.id          |
| item_2_id  | INT                        | FK → items.id          |
| status     | ENUM('active','closed')    | DEFAULT 'active'       |
| ad_shown   | BOOLEAN                    | DEFAULT false          |
| created_at | TIMESTAMP                  | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP                  | ON UPDATE CURRENT_TIMESTAMP |

### `messages`
| Coluna     | Tipo      | Restrições             |
| ---------- | --------- | ---------------------- |
| id         | INT       | PK, AUTO_INCREMENT     |
| match_id   | INT       | FK → matches.id        |
| sender_id  | INT       | FK → users.id          |
| content    | TEXT      | NOT NULL               |
| read_at    | TIMESTAMP | NULL                   |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### `ads`
| Coluna           | Tipo         | Restrições             |
| ---------------- | ------------ | ---------------------- |
| id               | INT          | PK, AUTO_INCREMENT     |
| title            | VARCHAR(200) | NOT NULL               |
| image_url        | VARCHAR(500) | NOT NULL               |
| redirect_url     | VARCHAR(500) | NULL                   |
| duration_seconds | INT          | DEFAULT 30             |
| is_active        | BOOLEAN      | DEFAULT true           |
| impressions      | INT          | DEFAULT 0              |
| clicks           | INT          | DEFAULT 0              |
| created_at       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP |
| updated_at       | TIMESTAMP    | ON UPDATE CURRENT_TIMESTAMP |

## Índices Recomendados

```sql
-- Performance de busca no feed
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_category ON items(category);

-- Performance de curtidas
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_item_id ON likes(item_id);

-- Performance de matches
CREATE INDEX idx_matches_user_1 ON matches(user_1_id);
CREATE INDEX idx_matches_user_2 ON matches(user_2_id);

-- Performance de chat
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Fotos
CREATE INDEX idx_photos_item_id ON photos(item_id);
```
